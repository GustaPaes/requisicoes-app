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
    this.form = this.fb.group({
      id: new FormControl(""),
      dataAbertura: new Date(),
      departamentoId: new FormControl("", [Validators.required]),
      departamento: new FormControl(""),
      descricao: new FormControl("", [Validators.required, Validators.minLength(3)]),
      equipamentoId: new FormControl("", [Validators.required]),
      equipamento: new FormControl("")
    });

    this.requisicoes$ = this.requisicaoService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
    this.equipamentos$ = this.equipamentoService.selecionarTodos();
  }

  get tituloModal(): string {
    return this.id?.value ? "Atualiza????o" : "Cadastro";
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
          this.toastrService.success("A requisi????o foi inserido com sucesso", "Inser????o de Requisi????es");
        }
        else
        {
          await this.requisicaoService.editar(this.form.value);
          this.toastrService.success("A requisi????o foi editado com sucesso", "Edi????o de Requisi????es");
        }
      }

    } catch (error) {
      if (error != "fechar" && error != "0" && error != "1")
        this.toastrService.error("Houve um erro ao tentar salvar o Equipamento! Tente novamente.", "Cadastro de Requisi????es")
    }

  }

  public excluir(requisicao: Requisicao) {
    try {
      this.requisicaoService.excluir(requisicao);
      this.toastrService.success("A requisi????o foi excluida com sucesso!", "Exclus??o de Requisi????es");
    } catch (error) {
      this.toastrService.error("Houve um erro ao tentar excluir a Requisi????o! Tente novamente.", "Exclus??o de Requisi????es");
    }
  }

}
