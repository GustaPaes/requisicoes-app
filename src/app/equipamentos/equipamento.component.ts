import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html'
})
export class EquipamentoComponent implements OnInit {
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private equipamentoService: EquipamentoService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(""),
      numSerie: new FormControl("",[Validators.required, Validators.minLength(3)]),
      nome: new FormControl("",[Validators.required, Validators.minLength(3)]),
      precoAquisicao: new FormControl("",[Validators.required, Validators.minLength(1)]),
      dataFabricacao: new FormControl("",[Validators.required]),
    });

    this.equipamentos$ = this.equipamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id(): AbstractControl | null {
    return this.form.get("id");
  }

  get numSerie(): AbstractControl | null {
    return this.form.get("numSerie");
  }

  get nome(): AbstractControl | null {
    return this.form.get("nome");
  }

  get precoAquisicao(): AbstractControl | null {
    return this.form.get("precoAquisicao");
  }

  get dataFabricacao(): AbstractControl | null {
    return this.form.get("dataFabricacao");
  }

  public async gravar(modal: TemplateRef<any>, equipamento?: Equipamento) {
    this.form.reset();

    if (equipamento)
      this.form.setValue(equipamento);

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!equipamento)
        {
          await this.equipamentoService.inserir(this.form.value)
          this.toastrService.success("O equipamento foi inserido com sucesso", "Inserção de Equipamentos");
        }
        else
        {
          await this.equipamentoService.editar(this.form.value);
          this.toastrService.success("O equipamento foi editado com sucesso", "Edição de Equipamentos");
        }
      }

    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error("Houve um erro ao salvar o equipamento. Tente novamente.", "Cadastro de Equipamentos")
    }
  }

  public async excluir(equipamento: Equipamento) {
    try {
      await this.equipamentoService.excluir(equipamento);

      this.toastrService.success(`O equipamento foi excluído com sucesso!`, "Cadastro de Equipamentos");
    } catch (error) {
      this.toastrService.error("Houve um erro ao excluir o equipamento. Tente novamente.", "Cadastro de Equipamentos")
    }
  }

}
