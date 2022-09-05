import { DATE_PIPE_DEFAULT_TIMEZONE, JsonPipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Equipamento } from '../equipamentos/models/equipamento.model';
import { EquipamentoService } from '../equipamentos/services/equipamento.service';
import { Requisicao } from './models/requisicao.model';
import { RequisicaoService } from './services/requisicao.service';

@Component({
  selector: 'app-requisicao',
  templateUrl: './requisicao.component.html'
})
export class RequisicaoComponent implements OnInit {
  public requisicoes$: Observable<Requisicao[]>;
  public departamentos$: Observable<Departamento[]>;
  public equipamentos$: Observable<Equipamento[]>;
  public form: FormGroup;

  constructor(
    private requisicaoService: RequisicaoService,
    private departamentoService: DepartamentoService,
    private equipamentoService: EquipamentoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.fb.group({
      id: new FormControl(""),
      dataAbertura: new Date(),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),
      equipamentoId: new FormControl("", [Validators.required]),
      equipamento: new FormControl("")
    })
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualização" : "Cadastro";
  }

  get id() {
    return this.form.get("id");
  }

  get dataAbertura() {
    return this.form.get("dataAbertura");
  }

  get departamentoId() {
    return this.form.get("departamentoId");
  }

  get descricao() {
    return this.form.get("descricao");
  }

  get equipamentoId() {
    return this.form.get("equipamentoId");
  }

  public async gravar(modal: TemplateRef<any>, requisicao?: Requisicao) {
    this.form.reset();

    if (requisicao) {
      const departamento = requisicao.departamento ? requisicao.departamento : null;
      const equipamento = requisicao.equipamento ? requisicao.equipamento : null;

      // spread operator (Javascript)
      const requisicaoCompleta = {
        ...requisicao,
        departamento,
        equipamento
      }

      this.form.setValue(requisicaoCompleta);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (!requisicao)
        {
          await this.requisicaoService.inserir(this.form.value)
          this.toastrService.success("A requisição foi inserido com sucesso", "Inserção de Requisições");
        }
        else
        {
          await this.requisicaoService.editar(this.form.value);
          this.toastrService.success("A requisição foi editado com sucesso", "Edição de Requisições");
        }
      }

    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error("Houve um erro ao tentar salvar o Equipamento! Tente novamente.", "Cadastro de Requisições")
    }

  }

  public excluir(requisicao: Requisicao) {
    try {
      this.requisicaoService.excluir(requisicao);
      this.toastrService.success("A requisição foi excluida com sucesso!", "Exclusão de Requisições");
    } catch (error) {
      this.toastrService.error("Houve um erro ao tentar excluir a Requisição! Tente novamente.", "Exclusão de Requisições");
    }
  }

}
